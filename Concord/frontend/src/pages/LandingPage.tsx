// Libraries
import React from 'react';
import { Link } from 'react-router-dom';

// MaterialUI
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';


export default function LandingPage() {
	const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'blue';
		e.currentTarget.style.color = 'white';
   
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'white';
		e.currentTarget.style.color = 'blue';
    
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', paddingTop: '20%' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Concord The Chat App!
      </Typography>

      <Button
        className="mt-8"
				component={Link}
        variant="outlined"
        color="primary"
        size="large"
        to="/Conversations"
        style={{
          color: 'blue',
          borderColor: 'blue',
          backgroundColor: 'white',
          transition: 'background-color 0.3s ease, transform 0.5s ease',
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        Log In
      </Button>
    </Container>
	)
}