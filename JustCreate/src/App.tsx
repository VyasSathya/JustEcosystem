import React from "react";
import { Box, Container } from "@mui/material";
import { ProductSwitcher } from "./components/ProductSwitcher";
import { Logo } from "./components/Logo";
import { TemplateGallery } from "./components/TemplateGallery";

export default function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={4}>
        <Logo />
        <ProductSwitcher />
        <TemplateGallery />
      </Box>
    </Container>
  );
}
