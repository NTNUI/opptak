import { Container } from '@mantine/core';
import axios from 'axios';
import React, { useState } from 'react';


function App() {
  const [test, setTest] = useState();
  axios.get("http://localhost:8082/test").then(res => setTest(res.data.msg))
  return (
   <Container>
     <p>{test}</p>
   </Container>
  );
}

export default App;
