import {
  useContext,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import { UserContext } from "../../context/user.context";

import Loading from "../../components/loading/loading.component";
import FormInput from "../../components/form-input/form-input";

interface IUserLoginFrom {
  email: string;
  password: string;
}

const defaultFormFields = {
  email: "",
  password: "",
};

const formFieldInputs = [
  {
    label: "Email",
    type: "email",
    name: "email",
    id: "sign-in-email",
    required: true,
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    id: "sign-in-password",
    required: true,
  },
];

function Login() {
  const { userState, setActiveUser } =
    useContext(UserContext);

  const [formFields, setFormFields] =
    useState<IUserLoginFrom>(defaultFormFields);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  type FormFieldsKey = keyof typeof formFields;

  const { email, password } = formFields;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.name === "rememberLogin") {
      return setRememberLogin((prev) => !prev);
    }
    setFormFields((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    let everyThingIsFine = true;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email === "" || !email || !emailRegex.test(email)) {
      alert("Invalid email address.");
      everyThingIsFine = false;
    }

    if (password === "" || !password) {
      alert("You should provide a password.");
      everyThingIsFine = false;
    }

    return everyThingIsFine;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      email,
      password,
    };

    // fetch()
  };

  if (userState.currentUser) {
    return <Navigate to={"/"} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="border border-slate-600 rounded-xl flex flex-col justify-around px-4 h-3/5 w-3/4"
      >
        <div>
          {formFieldInputs.map((input) => (
            <FormInput
              key={input.id}
              allInputOptions={{
                ...input,
                value:
                  formFields[input.name as FormFieldsKey],
                onChange: handleChange,
              }}
            />
          ))}
          {/* remember me */}
          <div>
            <input
              type="checkbox"
              name="rememberLogin"
              id="sign-in-remember"
              checked={rememberLogin}
              onChange={handleChange}
            />
            <label
              className="pl-2 "
              htmlFor="sign-in-remember"
            >
              Remember Me
            </label>
          </div>
        </div>
        {/* Login button and forgot password */}
        <div>
          <Link
            className="block pb-4 text-blue-400"
            to={"/forgot-password"}
          >
            Forgot Password?
          </Link>
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-800 rounded-md h-10 font-bold w-full"
          >
            Login
          </button>
        </div>
      </form>
      {/* Link to sign up */}
      <div className="border border-slate-600 rounded-xl flex items-center justify-around px-4 mt-4 w-3/4 h-12">
        <p>
          {"New here? "}
          <Link
            className=" text-blue-400"
            to={"/forgot-password"}
          >
            Create an account
          </Link>
          {" ."}
        </p>
      </div>
    </div>
  );
}

export default Login;
