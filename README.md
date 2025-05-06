# Castven & Kilian WAC project

- Students: Lukas Castven, Michal Kilian
- Github mono-repo: https://github.com/Nesquiko/xcastven-xkilian-wac-project
- Azure web app: https://xcsatven-xkilian-project-dvesfkh5dddkdefc.germanywestcentral-01.azurewebsites.net/
- Cluster
  - project name: Castven Kilian project
  - project link: https://wac-2025.westeurope.cloudapp.azure.com/fea/xcastven-xkilian-project

## Testing

The css is little bugged, but the app is functional, but not visually pleasing.
However on localhost it looks stunning 😉.

- Patient login email: pat@ient.sk
- Doctor login email: uro@log.sk

When logged, there is a small footer which isn't visible, just scroll down a little.
Patient has buttons there for scheduling an appointment and health condition,
doctor only legend in the right corner.

### What can patient do

As a patient, you can look at your medical calendar, which contains:

- appointments (requested, scheduled, canceled, denied, completed)
- prescriptions
- health conditions

You can click on the individual item to see its details, or on a day and
see appointments, prescriptions, conditions for that day.

Then, in the footer, you can schedule an appointment or register a health condition.

### What can doctor do

Doctor can see requested and scheduled appointments in calendar, other types
are hidden but can be accessed when clicking on a day. They can accept, or reject
an appointment, can add prescriptions to an appointment, or reserve resources
such as medicine, equipment or a facility to an appointment.
