import { Box } from "@mantine/core";
import internal from "stream";
import { CommaListExpression } from "typescript";
import IApplication from "../types/application";



const ApplicationItem = ({name, committees} : IApplication) => (
    <Box
  sx={(theme) => ({
    color: theme.colors.gray[2],
    border: "2px solid #F8F082",
    textAlign: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#282c34',
    },
  })}
>
  {name} | committee-name
</Box>
);

export default ApplicationItem;