import React from "react";
import { Box, Button, Typography } from "@mui/material";

const products = [
  { name: "JustStuff", url: "https://github.com/VyasSathya/JustStuff" },
  { name: "JustStuffExt", url: "https://github.com/VyasSathya/JustStuffExt" },
  { name: "JustCreate", url: "#" },
  { name: "JustEnglish", url: "#" },
  { name: "JustImagine", url: "#" },
  { name: "JustDraft", url: "#" }
];

export function ProductSwitcher() {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
      {products.map((prod) => (
        <Button
          key={prod.name}
          variant={prod.name === "JustCreate" ? "contained" : "outlined"}
          href={prod.url}
          target="_blank"
          sx={{ fontFamily: "Montserrat, Arial, sans-serif", fontWeight: 700 }}
        >
          {prod.name}
        </Button>
      ))}
    </Box>
  );
}
