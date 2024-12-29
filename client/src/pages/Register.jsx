import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
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
    if (!formData.height) newErrors.height = "Height is required!";
    if (!formData.weight) newErrors.weight = "Weight is required!";
    if (!formData.gender) newErrors.gender = "Gender is required!";
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required!";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
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
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Row className="w-100">
            {/* Left Column */}
            <Col md={6}>
              <Form.Group className="mb-2" controlId="formFirstname">
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

              <Form.Group className="mb-2" controlId="formLastname">
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

              <Form.Group className="mb-2" controlId="formEmail">
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
              <Form.Group className="mb-2" controlId="formHeight">
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="text"
                  name="height"
                  placeholder="Enter your height (175)"
                  value={formData.height}
                  onChange={handleChange}
                  isInvalid={!!errors.height}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.height}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Right Column */}

            <Col md={6}>
              <Form.Group className="mb-2" controlId="formWeight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  placeholder="Enter your weight (80)"
                  value={formData.weight}
                  onChange={handleChange}
                  isInvalid={!!errors.weight}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.weight}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  isInvalid={!!errors.gender}
                >
                  <option value="">Select your gender</option>{" "}
                  {/* Placeholder */}
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
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

              <Form.Group className="mb-2" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button className="btn btn-secondary mt-3" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
