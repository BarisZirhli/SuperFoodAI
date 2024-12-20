import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Alert } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "Firstname is required!";
    if (!formData.lastname) newErrors.lastname = "Lastname is required!";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setSuccess(true);
      setErrors({});
      console.log("Form Submitted:", formData);
    } else {
      setErrors(validationErrors);
      setSuccess(false);
    }
  };

  return (
    <div className="container registerContainer mt-5 d-flex flex-column justify-content-center bg-light p-3 px-5 rounded">
      <div>
        <h2 className="mb-4 text-center">Register</h2>
        {success && <Alert variant="success">Registration successful!</Alert>}
        <Form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center align-items-center  "
        >
          <Form.Group className="mb-3" controlId="formFirstname">
            <Form.Label>Firstname</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              placeholder="Enter your firstname"
              value={formData.firstname}
              onChange={handleChange}
              isInvalid={!!errors.firstname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              placeholder="Enter your lastname"
              value={formData.lastname}
              onChange={handleChange}
              isInvalid={!!errors.lastname}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastname}
            </Form.Control.Feedback>
          </Form.Group>

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

          <Button className="btn btn-secondary mt-3" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
