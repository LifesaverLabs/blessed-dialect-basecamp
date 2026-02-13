
-- Create app roles enum with korrekt Blesséd spelling
CREATE TYPE public.app_role AS ENUM ('kalmitee_member', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'kalmunity_member',
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone kan read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users kan update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users kan insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone kan read roles"
  ON public.user_roles FOR SELECT
  USING (true);

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'kalmunity_member'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_kreated
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Kalmitee rekommendations table
CREATE TABLE public.kalmitee_rekommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  konfidence INTEGER NOT NULL CHECK (konfidence >= 0 AND konfidence <= 100),
  notes TEXT,
  kreated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (proposal_id, member_id)
);

ALTER TABLE public.kalmitee_rekommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone kan read rekommendations"
  ON public.kalmitee_rekommendations FOR SELECT
  USING (true);

CREATE POLICY "Kalmitee members kan insert rekommendations"
  ON public.kalmitee_rekommendations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'kalmitee_member') AND auth.uid() = member_id);

CREATE POLICY "Kalmitee members kan update own rekommendations"
  ON public.kalmitee_rekommendations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'kalmitee_member') AND auth.uid() = member_id);

-- Enable realtime for rekommendations
ALTER PUBLICATION supabase_realtime ADD TABLE public.kalmitee_rekommendations;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_kolumn()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_kolumn();

CREATE TRIGGER update_rekommendations_updated_at
  BEFORE UPDATE ON public.kalmitee_rekommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_kolumn();
