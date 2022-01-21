import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
class ContributeForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };
  onSubmit = async (event) => {
    event.preventDefault();
    const instance = Campaign(this.props.address);
    this.setState({ errorMessage: "", loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await instance.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      console.log("harsh");
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "" });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            label="ether"
            labelPosition="right"
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
