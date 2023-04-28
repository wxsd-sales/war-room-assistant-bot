import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ThemeProvider } from "@mui/material/styles";
import * as constants from "../../constants";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function MemberDetails({ submitErrors, sendDataToParent, data }) {
  const [memberList, setMemberList] = useState([
    { name: "", email: "", number: "" },
  ]);
  const [currentMemberList, setCurrentMemberList] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [errors, setErrors] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count == 0 && data) {
      setMemberList(data);
      setCurrentMemberList(data[data.length - 1]);
      setCount(1);
    }
    sendDataToParent(memberList, currentMemberList);
  });

  const handleMemberAdd = async () => {
    try {
      setErrors("");
      await constants.validationSchema.validate(currentMemberList, {
        abortEarly: false,
      });

      setMemberList([...memberList, { name: "", email: "", number: "" }]);
    } catch (error) {
      setErrors(error.inner);
    }
  };

  const handleMemberRemove = (index) => {
    const list = [...memberList];
    list.splice(index, 1);
    setMemberList(list);
  };

  const handleMemberNameChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setCurrentMemberList({
      ...currentMemberList,
      [name]: value,
    });
    setMemberList(list);
  };

  const handleMemberEmailChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setCurrentMemberList({
      ...currentMemberList,
      [name]: value,
    });
    setMemberList(list);
  };

  const handleMemberNumberChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setCurrentMemberList({
      ...currentMemberList,
      [name]: value,
    });
    setMemberList(list);
  };

  return (
    <ThemeProvider theme={constants.theme}>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            <b> Enter Member Details:</b>
          </Typography>
        </Grid>

        {memberList.map((singleScenario, index) => (
          <Card sx={constants.styleCard} variant="outlined">
            <CardContent>
              <Grid container spacing={2} padding={2} key={index}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    id="name"
                    label="Full Name"
                    name="name"
                    value={singleScenario.name}
                    onChange={(e) => handleMemberNameChange(e, index)}
                    error={
                      index === memberList.length - 1 &&
                      (errors[2] || submitErrors[2])
                    }
                    helperText={
                      index === memberList.length - 1 &&
                      (errors[2]
                        ? errors[2].message
                        : submitErrors[2]
                        ? submitErrors[2].message
                        : "")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    name="email"
                    label="Email"
                    id="email"
                    autoComplete="new-email"
                    value={singleScenario.email}
                    onChange={(e) => handleMemberEmailChange(e, index)}
                    error={
                      index === memberList.length - 1 &&
                      (errors[0] || submitErrors[0])
                    }
                    helperText={
                      index === memberList.length - 1 &&
                      (errors[0]
                        ? errors[0].message
                        : submitErrors[0]
                        ? submitErrors[0].message
                        : "")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    name="number"
                    label="Phone Number"
                    id="number"
                    autoComplete="new-number"
                    value={singleScenario.number}
                    onChange={(e) => handleMemberNumberChange(e, index)}
                    error={
                      index === memberList.length - 1 &&
                      (errors[1] || submitErrors[1])
                    }
                    helperText={
                      index === memberList.length - 1 &&
                      (errors[1]
                        ? errors[1].message
                        : submitErrors[1]
                        ? submitErrors[1].message
                        : "")
                    }
                  />
                </Grid>
                {memberList.length > 1 && (
                  <Grid item xs={12} sm={1} padding={3} sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      color="error"
                      sx={constants.styleButton}
                      onClick={() => handleMemberRemove(index)}
                      startIcon={<RemoveIcon />}
                    >
                      Remove
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        ))}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            onClick={handleMemberAdd}
            color="cyan"
            sx={constants.styleButton}
            startIcon={<AddIcon />}
          >
            Add Members
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default MemberDetails;
