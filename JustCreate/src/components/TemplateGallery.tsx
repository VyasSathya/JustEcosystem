import React from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";

const templates = [
  { name: "CRA (React)", description: "Create React App starter template." },
  { name: "JustEnglish", description: "Language learning project template." },
  { name: "JustImagine", description: "Creative ideation project template." },
  { name: "JustDraft", description: "Writing and drafting project template." }
];

export function TemplateGallery() {
  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom align="center">
        Project Templates
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {templates.map((tpl) => (
          <Grid item xs={12} sm={6} md={3} key={tpl.name}>
            <Card sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{tpl.name}</Typography>
                <Typography variant="body2" color="text.secondary">{tpl.description}</Typography>
              </CardContent>
              <Button variant="contained" sx={{ m: 2, fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 700 }}>
                Create
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
