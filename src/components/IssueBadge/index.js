import React, { lazy } from "react";
import { Row, Col } from "antd";
import Zoom from "react-reveal/Zoom";
import { withTranslation } from "react-i18next";
import { Checkbox } from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import BitcloutLogin from "react-bitclout-login";
import useForm from "./useForm";
import validate from "./validationRules";
import axios from "axios";
import * as S from "./styles";

const Block = lazy(() => import("../Block"));
const Input = lazy(() => import("../../common/Input"));
const Button = lazy(() => import("../../common/Button"));
const TextArea = lazy(() => import("../../common/TextArea"));

const IssueBadge = ({ title, content, id, t }) => {
  const { values, errors, handleChange, handleSubmit } = useForm(validate);
  const [checked, setChecked] = React.useState(false);

  const ValidationType = ({ type }) => {
    const ErrorMessage = errors[type];
    return errors[type] ? (
      <Zoom cascade>
        <S.Span>{ErrorMessage}</S.Span>
      </Zoom>
    ) : (
      <S.Span />
    );
  };

  const [selectedStartDate, setSelectedStartDate] = React.useState(Date.now());
  const [selectedEndDate, setSelectedEndDate] = React.useState(Date.now());

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleCheckbox = (event) => {
    setChecked(event.target.checked);
  };

  const responseClout = (response) => {
    for (let x in response) {
      window.localStorage.setItem(x, response[x]);
    }
    console.log(response);
    const url = `https://us-central1-bitbadges.cloudfunctions.net/api/username/${window.localStorage.getItem(
      "publicKey"
    )}`;
    axios({
      method: "get",
      url: url,
    })
      .then((response) => {
        console.log(response);
        window.localStorage.setItem("username", response.data.Profile.Username);
        window.location.href = "/home";
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <S.IssueBadgeContainer id={id}>
      <S.IssueBadge>
        <Row type="flex" justify="space-between" align="middle">
          <Col lg={12} md={11} sm={24}>
            <Block
              padding={true}
              title={"Issue a badge!"}
              content={
                "Issue a badge to another user! Add their name in the recipient box, give it a title, and add any other accompanying details you choose. Note that everything is permanently stored on the blockchain and interplanetary file system (IPFS). This means that the badge cannot ever be changed once submitted, so double check before submitting!"
              }
            />
            <img src="https://bitbadges.s3.amazonaws.com/badge.png"></img>
          </Col>
          {/** 
           * badges: [
    {
      issuer: "", //required to not be empty
      recipient: "", //required to not be empty
      imageUrl: "",
      title: "", //requied to not be empty
      externalUrl: "",
      backgroundColor: "", //required to not be empty
      description:""
      validDates: true,
      validDateStart: 1, //integer representing seconds since UNIX epoch
      validDateEnd: 5, //integer representing seconds since UNIX epoch
    },
  ],
          */}
          <Col lg={12} md={12} sm={24}>
            <S.FormGroup autoComplete="off" onSubmit={handleSubmit}>
              <Col span={24}>
                <Input
                  type="text"
                  name="title"
                  id="Title"
                  placeholder=""
                  value={values.title || ""}
                  onChange={handleChange}
                />
                <ValidationType type="title" />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="recipient"
                  id="Recipient's BitClout Username"
                  placeholder=""
                  value={values.recipient || ""}
                  onChange={handleChange}
                />
                <ValidationType type="recipient" />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="imageUrl"
                  id="Image URL"
                  placeholder=""
                  value={values.imageUrl || ""}
                  onChange={handleChange}
                  additionalInfo="*Note that once submitted, this badge can never unpoint to this URL. Consider using IPFS or another permanent file storage option. If blank, defaults to solid image of background color."
                />
                <ValidationType type="imageUrl" />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="externalUrl"
                  id="External URL"
                  placeholder=""
                  value={values.externalUrl || ""}
                  onChange={handleChange}
                  additionalInfo="*Note that once submitted, this badge can never unpoint to this URL. Consider using IPFS or another permanent file storage option."
                />
                <ValidationType type="externalUrl" />
              </Col>
              <Col span={24}>
                <Input
                  type="text"
                  name="backgroundColor"
                  id="Background Color"
                  placeholder=""
                  value={values.backgroundColor || ""}
                  onChange={handleChange}
                  additionalInfo="*Background colors must be a hex value in format '#FFFFFF' or a valid HTML color name. Visit www.w3schools.com/colors/colors_names.asp for more info. Defaults to black."
                />
                <ValidationType type="backgroundColor" />
              </Col>

              <Col span={24}>
                <TextArea
                  placeholder=""
                  value={values.description || ""}
                  name="description"
                  id="Description"
                  onChange={handleChange}
                  additionalInfo="*Add all additional details you wish to provide here. Note that accounts can change username and can change ownership, but badges will always be tied to the public key of an account."
                />
                <ValidationType type="description" />
              </Col>
              <Col span={24}>
                <label htmlFor="validDatesCheckbox">Start/End Dates?</label>
                <Checkbox
                  id="validDatesCheckbox"
                  checked={checked}
                  onChange={handleCheckbox}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </Col>
              <Col span={24}>
                {checked ? (
                  <>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Start Date"
                        format="MM/dd/yyyy"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="End Date"
                        format="MM/dd/yyyy"
                        value={selectedEndDate}
                        onChange={handleEndDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </>
                ) : (
                  <></>
                )}
                <ValidationType type="validDates" />
              </Col>
              <S.ButtonContainer>
                <Button name="submit" type="submit">
                  {t("Submit")}
                </Button>
              </S.ButtonContainer>
            </S.FormGroup>
          </Col>
        </Row>
      </S.IssueBadge>
    </S.IssueBadgeContainer>
  );
};

export default withTranslation()(IssueBadge);
