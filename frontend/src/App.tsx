import { Container } from '@mantine/core'
import axios from 'axios'
import React, { useState } from 'react'
import "./App.css";
import ApplicationList from './components/ApplicationList';

function App() {
	const [test, setTest] = useState()
	axios.get('http://localhost:8082/test').then((res) => setTest(res.data.msg))
	return (
		<Container>
			<ApplicationList />
		</Container>
	)
}

export default App
