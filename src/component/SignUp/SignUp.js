import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/register', formData);

      if (response.status === 201) {
        // Handle successful registration (e.g., show a success message)
      } else {
        setError('An error occurred during user registration');
      }
    } catch (err) {
      setError('An error occurred during user registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup-container">
      <Card sx={{ maxWidth: 700, margin: '30px auto', border: '3px solid #356' }}>
      
        <CardContent>
          <Container maxWidth="xs">
            <Box sx={{ mt: 0 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Register
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      name="username"
                      fullWidth
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Typography color="error" variant="body2">
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                      {loading ? 'Processing...' : 'Register'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Container>
        </CardContent>
      </Card>

     
    </div>
  );
}
