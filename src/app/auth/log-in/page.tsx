import LogIn from "@/components/auth/login";

export const metadata = {
    title: 'Log in',
    description: 'Access your account by logging in with your email and password. If you don’t have an account, please sign up first.'
};

const LogInPage = async () => {
    return <LogIn/>
}

export default LogInPage