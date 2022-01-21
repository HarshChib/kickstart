import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../../components/Layout";
import campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/contribute";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const instance = campaign(props.query.address);
    const summary = await instance.methods.getSummary().call();
    return {
      address: props.query.address,
      minContri: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }
  renderCard() {
    const { minContri, balance, requestCount, approversCount, manager } =
      this.props;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minContri,
        meta: "Minimum Contribution(Wei)",
        description: "Minimum ammount to become an Approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Number of requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "Number of people already donated to Campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Balance(Ether)",
        description: "This is money Campaign has left to spend",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCard()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
