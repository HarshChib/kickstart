import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message, Loader } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };
  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ errorMessage: "" });
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute("/");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };
  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              value={this.state.minimumContribution}
              label="wei"
              labelPosition="right"
              onChange={(event) => {
                this.setState({ minimumContribution: event.target.value });
              }}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} type="submit" primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
