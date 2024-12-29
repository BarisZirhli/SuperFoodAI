import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
        
        if (response.data.success) {
          setSuccess(true);
          setErrorMessage("");
          console.log("Login Successful:", response.data);
          
          localStorage.setItem("authToken", response.data.token);
          
         } else {
          setErrorMessage(response.data.message || "Login failed!");
          setSuccess(false);
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        setSuccess(false);
      }
    } else {
      setErrors(validationErrors);
      setSuccess(false);
    }
  };

  return (
    <div className="container registerContainer mt-5 d-flex flex-column justify-content-center bg-light p-3 px-5 rounded">
      <div>
        <h2 className="mb-4 text-center">Login</h2>
        {success && <Alert variant="success">Login successful!</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button className="btn btn-primary mt-3" type="submit">
            Login
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-decoration-none">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
