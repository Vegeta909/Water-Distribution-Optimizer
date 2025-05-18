import React from 'react';
import { Typography, Paper, Stepper, Step, StepLabel } from '@mui/material';

function ProcessSteps({ steps, activeStep = -1 }) {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
        How It Works
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="body2" fontWeight={500}>
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}

export default ProcessSteps;
