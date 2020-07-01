import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  FormLabel,
  FormControl,
  FormGroup,
  CircularProgress,
  Button
} from "@material-ui/core";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { makeStyles } from "@material-ui/core/styles";
import { createUrlShorten } from "./api/api.js";
import { Alert } from "@material-ui/lab";
import { IUrlShorten } from "./types/types";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
    border: "lightgray solid 1px",
    padding: "25px"
  },
  formGroup: {
    backgroundColor: "#f1f1f1",
    padding: "25px"
  }
}));

const Create = () => {
  const [error, setError] = useState(undefined);
  const [successData, setSuccessData] = useState<IUrlShorten | undefined>(
    undefined
  );
  const [isSaving, setSaving] = useState(false);

  const handleSubmit = async (form_values: any) => {
    setError(undefined);
    setSuccessData(undefined);
    setSaving(true);
    const response: any = await createUrlShorten(form_values);
    if (response.error) {
      setError(response.error);
    } else {
      setSuccessData(response?.data);
    }
    setSaving(false);
  };

  const validateForm = values => {
    const errors = {} as any;
    if (!values.url) errors.url = "* required";
    return errors;
  };

  const initialValues = {
    url: "",
    expiration_date: undefined
  };

  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <div className="util-flexRow">
        <div>
          <FormLabel>
            Create / Update
            <ul>
              <li>Enter new URL to create</li>
              <li>Enter exist URL to update expiration date</li>
            </ul>
            Eg.
            <ul>
              <li>Valid URL: http://google.com</li>
              <li>Invalid URL: google.com</li>
              <li>Blacklist: http://example.com, http://microsoft.com</li>
            </ul>
          </FormLabel>
        </div>

        <div className="util-marginLeftLg">
          <FormGroup className={classes.formGroup}>
            <Formik
              enableReinitialize
              initialValues={{ ...initialValues }}
              onSubmit={handleSubmit}
              validateOnChange
              validate={validateForm}
            >
              {({ errors, setFieldValue }) => {
                return (
                  <Form>
                    <div className="util-flexRow">
                      <div>
                        <Field
                          name="url"
                          render={({ field, form }) => (
                            <TextField
                              label="Please enter full URL"
                              onChange={e =>
                                setFieldValue("url", e.currentTarget.value)
                              }
                            />
                          )}
                        />
                        {errors.url && (
                          <div className="util-textRed">{errors.url}</div>
                        )}
                      </div>
                      <div className="util-marginLeftLg">
                        <div className="MuiTypography-body1">
                          Expiration Date
                        </div>
                        <div className="util-marginTop">
                          <Field
                            name="expiration_date"
                            render={({ field, form }) => (
                              <DayPickerInput
                                format={"yyyy/MM/dd"}
                                onDayChange={day =>
                                  setFieldValue("expiration_date", day)
                                }
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="util-marginTopLg util-flexRowCenter">
                      {!isSaving && (
                        <Button
                          variant="contained"
                          size="large"
                          color="primary"
                          type="submit"
                        >
                          Create / Update
                        </Button>
                      )}
                      {isSaving && <CircularProgress />}
                    </div>
                    {error && (
                      <div className="util-marginTopLg">
                        <Alert severity="error">{error}</Alert>
                      </div>
                    )}
                    {successData?.short_code && (
                      <div className="util-marginTopLg">
                        <Alert severity="success">
                          <Link
                            to="route"
                            target="_blank"
                            onClick={event => {
                              event.preventDefault();
                              window.open(
                                `${process.env.REACT_APP_API_URL}/visit/${successData.short_code}`
                              );
                            }}
                          >
                            Shorten URL created ({successData.short_code}) click
                            here to visit.
                          </Link>
                          <div>
                            <ul>
                              {Object.keys(successData).map(key => {
                                return (
                                  <li value={key}>
                                    [{key}] {successData[key]}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </Alert>
                      </div>
                    )}
                  </Form>
                );
              }}
            </Formik>
          </FormGroup>
        </div>
      </div>
    </FormControl>
  );
};

export default Create;
