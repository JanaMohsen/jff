import SignUp from "@/components/auth/signup";

export const metadata = {
    title: 'Sign up',
    description: 'Create an account to access all the features of our service. Please provide your email and set a password to get started.'
};

const SignUpPage = async () => {
    return <SignUp/>
}

export default SignUpPage