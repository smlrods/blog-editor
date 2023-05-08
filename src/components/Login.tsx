import { Divider, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';

interface LoginProps {
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

function Login({ setToken }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (input: string, setState: any) => {
    setState(input);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    
    const newLogin = {
      username,
      password
    }

    const res = await fetch(
      "https://blog-api-production-c132.up.railway.app/auth/login",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(newLogin)
    });

    if (res.status != 200) {
      setLoading(false);
      setError(true);
      return;
    }

    const data = await res.json();

    setToken(data.token);
    setTimeout(() => {
      navigate('/posts');
    }, 1500);
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Typography gutterBottom variant="h4" component="h2">
        Log in
      </Typography>
      <Divider sx={{ mb: 2 }}/>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Username"
          margin="normal"
          required
          fullWidth
          value={username}
          error={error}
          onChange={(event) => handleChange(event.target.value, setUsername)}
        />
        <TextField 
          label="Password"
          margin="normal"
          type="password"
          required
          fullWidth
          value={password}
          error={error}
          helperText={error ? "Username or password incorrect" : ''}
          onChange={(event) => handleChange(event.target.value, setPassword)}
        />
        <LoadingButton 
          variant="contained" 
          color="primary" 
          type="submit"
          loading={loading}
          >
          Log in
        </LoadingButton>
      </form>
    </Grid>
  );
}

export default Login;
