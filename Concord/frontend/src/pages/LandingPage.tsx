// Libraries
import React from 'react';
import { Link } from 'react-router-dom';

// MaterialUI
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';


export default function LandingPage() {
	return (
		<Container maxWidth="sm" style={{ textAlign: 'center', paddingTop: '100px' }}>
			<Typography variant="h3" component="h1" gutterBottom>
				Welcome to the Chat App Landing Page!
			</Typography>
			
			<Button className="mt-8" variant="contained" component={Link} to="/Conversations">
				Log In
			</Button>
		</Container>
	)
}