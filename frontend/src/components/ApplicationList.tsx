import { Container } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import ApplicationItem from "./ApplicationItem";
import ApplicationI from "../types/application";

let applications = require('../fixtures/applications.json');

let formatted = applications.map((item : ApplicationI, idx : number) => {
    return (
        <ApplicationItem key={idx} {...item} />
    )
})

const ApplicationList = () => (
    <Container>
		{formatted}
	</Container>
);

export default ApplicationList;