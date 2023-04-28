import { useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Copyright from "../Layout/Copyright";
import Navbar from "../Layout/Navbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { generalRequest } from "../DataHandling/httpRequest";
import { useNavigate } from "react-router-dom";
import * as constants from "../../constants";

function EditDetails() {
  let navigate = useNavigate();
  const { state } = useLocation();
  const tableRows = state.data.memberList.map((element) => {
    return (
      <TableRow>
        <TableCell>{element.name}</TableCell>
        <TableCell>{element.email}</TableCell>
        <TableCell>{element.number}</TableCell>
      </TableRow>
    );
  });
  const scenarioTableRows = state.data.scenarioList.map((element) => {
    return (
      <TableRow>
        <TableCell>{element.scenario}</TableCell>
        <TableCell>{element.call.toString()}</TableCell>
        <TableCell>{element.email.toString()}</TableCell>
        <TableCell>{element.sms.toString()}</TableCell>
      </TableRow>
    );
  });
  const handleEdit = () => {
    navigate("/details", {
      state: {
        personID: state.personID,
        avatar: state.avatar,
        memberList: state.data.memberList,
        scenarioList: state.data.scenarioList,
        teamId: state.data.teamID,
        teamName: state.data.teamName,
        isEdit: true,
        accessToken: state.accessToken,
      },
    });
  };
  const handleDelete = () => {
    const id = state.data._id;
    try {
      const res = generalRequest.delete(`/details/${id}`);
      if (res) {
        navigate("/details", {
          state: {
            personID: state.personID,
            avatar: state.avatar,
            accessToken: state.accessToken,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ThemeProvider theme={constants.theme}>
      <Navbar avatar={state.avatar} isLogin={false} />
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Grid align="center" sx={{ margin: 1, padding: 1 }}>
          <Typography component="h1" variant="h5">
            <b>Your Hanna Bot Data</b>
          </Typography>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Card sx={constants.styleEditCard} align="center" variant="outlined">
            <CardContent>
              <Grid container spacing={2} direction="column" justify="center">
                <Grid item xs={6} sx={{ margin: 1, padding: 1 }}>
                  <Typography component="h1" variant="h6">
                    Member Details
                  </Typography>
                  <Grid sx={{ margin: 1, padding: 1, width: "auto" }}>
                    <TableContainer sx={{ minWidth: 650, width: "auto" }}>
                      <Table
                        component={Paper}
                        sx={{ minWidth: 650, width: "auto" }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <b>Name</b>
                            </TableCell>
                            <TableCell>
                              <b>Email</b>
                            </TableCell>
                            <TableCell>
                              <b>Phone Number</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>{tableRows}</TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>

                <Grid item s={2} sx={{ margin: 1, padding: 1 }}>
                  <Typography component="h1" variant="h6">
                    Scenario Details
                  </Typography>
                  <Grid sx={{ margin: 1, padding: 1 }}>
                    <TableContainer sx={{ minWidth: 650, width: "auto" }}>
                      <Table
                        component={Paper}
                        sx={{ minWidth: 650, width: "auto" }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <b>Title</b>
                            </TableCell>
                            <TableCell>
                              <b>Call</b>
                            </TableCell>
                            <TableCell>
                              <b>Email</b>
                            </TableCell>
                            <TableCell>
                              <b>SMS</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>{scenarioTableRows}</TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>

                <Grid item s={2} sx={{ margin: 1, padding: 1 }}>
                  <Typography component="h1" variant="h6">
                    Webex Team Details
                  </Typography>

                  <Typography
                    component="h1"
                    variant="body2"
                    align="left"
                    sx={{ ml: 20, mt: 2 }}
                  >
                    <b>Team ID: </b> {state.data.teamID}
                  </Typography>
                </Grid>
              </Grid>

              <Button
                type="submit"
                align="center"
                variant="outlined"
                color="warning"
                sx={constants.styleEditButton}
                onClick={handleEdit}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                type="submit"
                align="center"
                variant="outlined"
                color="error"
                sx={constants.styleDeleteButton}
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Container>
      <Copyright />
    </ThemeProvider>
  );
}
export default EditDetails;
