import Copyright from "../Layout/Copyright";
import Navbar from "../Layout/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GetPersonInfo from "../Details/GetPersonInfo";
import GetMongoData from "../DataHandling/GetMongoData";

function EndPage() {
  const { state } = useLocation();
  let navigate = useNavigate();
  const [personDataFound, setPersonDataFound] = useState("2");

  useEffect(() => {
    const mongoData = () => {
      GetPersonInfo(state.accessToken).then((data) => {
        GetMongoData().then((mondata) =>
          mondata.every((element) => {
            if (data.id === element.personID) {
              navigate("/editdetails", {
                state: {
                  avatar: data.avatar,
                  personID: data.id,
                  data: element,
                  id: element.id,
                  accessToken: state.accessToken,
                },
              });
              setPersonDataFound("0");
              return false;
            } else if (data.id !== element.personID) {
              setPersonDataFound("1");
              return true;
            }
          })
        );
        if (personDataFound === "1") {
          navigate("/details", {
            state: {
              personID: data.id,
              avatar: data.avatar,
              accessToken: state.accessToken,
            },
          });
        }
      });
    };
    mongoData();
  });

  return (
    <>
      <Navbar avatar={state.avatar} isLogin={false} />
      <Copyright />
    </>
  );
}
export default EndPage;
