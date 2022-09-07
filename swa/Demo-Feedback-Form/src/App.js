import styles from "./App.module.css";
import { Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import {
  FontSizes,
  Text,
  TextField,
  PrimaryButton,
  DefaultPalette,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import axios from "axios";

function App() {
  const [alias, setAlias] = useState("");
  const [comment, setComment] = useState("");

  const [commentUrl, setCommentUrl] = useState("");

  const [loaded, setLoaded] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const APIM_SERVICE_URL = process.env.REACT_APP_APIM_SERVICE_URL;
  const APIM_SERVICE_SUBSCRIPTION_KEY = process.env.REACT_APP_APIM_SERVICE_SUBSCRIPTION_KEY;  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(APIM_SERVICE_SUBSCRIPTION_KEY)
      setLoaded(false);
      setSuccess(false);
      const config = {
        baseURL: APIM_SERVICE_URL,
        headers: {
          "Ocp-Apim-Subscription-Key": APIM_SERVICE_SUBSCRIPTION_KEY,
        },
      };
      var data = JSON.stringify({
        query: `mutation {
        addDiscussionComment(input: { body: "${alias} - ${comment}", discussionId: "D_kwDOH885WM4AQqzR" }) {
          comment {
            url
          }
        }
      }`,
        variables: {},
      });
      console.log(config);
      const response = await axios.post('/github', data, config);
      console.log(response);
      setCommentUrl(response.data.data.addDiscussionComment.comment.url);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoaded(true);
    }
  };
  
  return (
    <Container
      style={{
        height: "100vh",
      }}
      fluid
    >
      <Row>
        <Col className={styles.edge}></Col>
        <Col xs={5} className={styles.middle + " mt-5"}>
          <Text style={{ fontSize: FontSizes.xxLargePlus }} className="mb-3">
            {" "}
            APIM Authorizations Demo Feedback Form{" "}
          </Text>
          <TextField
            placeholder="Enter your Github alias"
            label="Alias"
            required
            onChange={(_, newValue) => setAlias(newValue)}
            className="mb-2"
          />
          <TextField
            placeholder="Enter comment"
            label="Comment"
            multiline
            autoAdjustHeight
            required
            className="mb-4"
            onChange={(_, newValue) => {
              setComment(newValue);
            }}
          />
          {loaded ? (
            <PrimaryButton
              className="mb-4"
              onClick={(e) => handleSubmit(e)}
              variant="primary"
            >
              Submit
            </PrimaryButton>
          ) : (
            <Spinner size={SpinnerSize.large} />
          )}

          {success ? (
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text
                className="mb-2"
                style={{ color: DefaultPalette.themePrimary }}
              >
                {" "}
                Successfully created comment!
              </Text>
              <Text>
                <a target="_blank" rel="noopener noreferrer" href={commentUrl}>
                  View in repo
                </a>
              </Text>
            </Col>
          ) : null}
        </Col>
        <Col className={styles.edge}></Col>
      </Row>
    </Container>
  );
}

export default App;
