import { MultiSelect } from "@mantine/core";
import React from "react";

const data = [
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
    { value: 'riot', label: 'Riot' },
    { value: 'next', label: 'Next.js' },
    { value: 'blitz', label: 'Blitz.js' },
  ];

  function Committees() {
    return (
      <MultiSelect
        data={data}
        label="Hva ønsker du å søke?"
        searchable
        placeholder="Pick all that you like"
      />
    );
  }

  export default Committees