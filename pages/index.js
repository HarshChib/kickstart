import React, { Component } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaignArray = await factory.methods.getDeployedCampaigns().call();
    return { campaignArray };
  }
  renderCampaign() {
    const items = this.props.campaignArray.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <div>
          <h3> Open Campaigns</h3>
          <Link route="campaigns/new">
            <a>
              <Button
                floated="right"
                icon="add"
                content="Create Campaign"
                primary
              />
            </a>
          </Link>
          {this.renderCampaign()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
