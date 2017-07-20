import React from 'react';
import Webiny from 'Webiny';

export default () => {
    return Webiny.import(['Tabs', 'Grid', 'Section', 'Input', 'Password', 'Alert', 'Copy']).then(Ui => {
        return (model, form) => {
            return (
                <Ui.Tabs.Tab label="Email" icon="fa-envelope">
                    <Ui.Tabs>
                        <Ui.Tabs.Tab label="General" icon="icon-settings">
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Section title="SMTP Settings"/>
                                    {form.bindTo(
                                        <Ui.Input
                                            label="Server Name"
                                            name="email.serverName"
                                            validate="required"
                                            description="For example: email-smtp.us-east-1.amazonaws.com"/>
                                    )}
                                    {form.bindTo(
                                        <Ui.Input
                                            label="Username"
                                            name="email.username"
                                            validate="required"/>
                                    )}
                                    {form.bindTo(
                                        <Ui.Password
                                            label="Password"
                                            name="email.password"
                                            validate="required"/>
                                    )}
                                    {form.bindTo(
                                        <Ui.Input
                                            label="Send limit (emails per second)"
                                            name="email.sendLimit"
                                            validate="required"/>
                                    )}
                                </Ui.Grid.Col>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Section title="AWS SNS Settings"/>
                                    <Ui.Alert title="AWS SES" close={false}>
                                        If you are using AWS SES to send emails, please check the setup guide in the next tab.
                                    </Ui.Alert>
                                    <dl>
                                        <dt>SNS Bounce Endpoint</dt>
                                        <dd>
                                            <Ui.Copy.Input
                                                value={`${webinyApiPath}/services/notification-manager/feedback/email/bounce`}/>
                                        </dd>

                                        <dt>SNS Complaint Endpoint</dt>
                                        <dd>
                                            <Ui.Copy.Input
                                                value={`${webinyApiPath}/services/notification-manager/feedback/email/complaint`}/>
                                        </dd>

                                        <dt>SNS Delivery Endpoint (optional)</dt>
                                        <dd>
                                            <Ui.Copy.Input
                                                value={`${webinyApiPath}/services/notification-manager/feedback/email/delivery`}/>
                                        </dd>
                                    </dl>
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                            <Ui.Grid.Row>
                                <Ui.Grid.Col all={6}>
                                    <Ui.Section title="Default Sender"/>
                                    {form.bindTo(
                                        <Ui.Input
                                            label="Sender Name"
                                            name="email.senderName"
                                            validate="required"/>
                                    )}
                                    {form.bindTo(
                                        <Ui.Input
                                            label="Sender email"
                                            name="email.senderEmail"
                                            validate="required,email"/>
                                    )}
                                </Ui.Grid.Col>
                            </Ui.Grid.Row>
                        </Ui.Tabs.Tab>

                        <Ui.Tabs.Tab label="AWS SES Setup Guide" icon="icon-info-circle">
                            <Ui.Section title="Step 1: Sign up for AWS and get your access credentials"/>

                            <ol>
                                <li>Create an AWS Console account (
                                    <a href="https://aws.amazon.com/" target="_blank">aws.amazon.com</a>
                                    ).
                                </li>
                                <li>Once you have your account go to
                                    <strong> Services </strong>
                                    &gt;
                                    <strong> Security &amp; Identity </strong>
                                    &gt;
                                    <strong> IAM </strong>
                                    .
                                </li>
                                <li>Click
                                    <strong> Users </strong>
                                    , in the left menu, and then
                                    <strong> Create New User </strong>
                                    .
                                </li>
                                <li>Give it a username, for example &quot;webiny&quot; and click
                                    <strong> Create </strong>
                                    .
                                </li>
                                <li>Click
                                    <strong> Show User Security Credentials </strong>
                                    and save the
                                    <strong> Access Key ID </strong>
                                    and
                                    <strong> Secret Access Key </strong>
                                    , we gonna use those in few minutes.
                                    <br/>
                                    Click
                                    <strong> Close </strong>
                                    to go back to the users list page.
                                </li>
                                <li>
                                    Once your user is created, go back to the
                                    <strong> Users </strong>
                                    list and click on
                                    your user to go to the user&lsquo;s detail page.
                                    <br/>
                                </li>
                                <li>
                                    On the details page, click on the
                                    <strong> Permissions </strong>
                                    tab, and then
                                    <strong> Attach Policy </strong>
                                    .
                                </li>
                                <li>
                                    In the policy filter search for
                                    <strong> AmazonSESFullAccess </strong>
                                    ,
                                    then select the policy and click
                                    <strong> Attach Policy </strong>
                                    .
                                </li>
                            </ol>

                            <Ui.Section title="Step 2: Setup AWS SES (Simple Email Service)"/>
                            <ol>
                                <li>In the top menu click
                                    <strong> Services </strong>
                                    &gt;
                                    <strong> Application Services </strong>
                                    &gt;
                                    <strong> SES </strong>
                                    .
                                </li>
                                <li>Click
                                    <strong> Email Addresses </strong>
                                    , in the left menu, and then
                                    <strong> Verify a New Email Address </strong>
                                    .
                                </li>
                                <li>
                                    Enter the mail address from which you will send your emails.
                                    <br/>
                                    <strong> NOTE: </strong>
                                    You can verify multiple email addresses.
                                    <br/>
                                    Alternatively you can go to
                                    <strong> Domains </strong>
                                    and verify a domain.
                                    In that case you can send email from any email address belonging to that domain.
                                </li>
                                <li>
                                    Once you have verified one or more emails (or domains), go to
                                    <strong> SMTP Settings </strong>
                                    in left menu.
                                </li>
                                <li>
                                    Copy the
                                    <strong> Server Name </strong>
                                    and paste the info in your Notification Manager settings
                                    into the
                                    <strong> Server Name </strong>
                                    field.
                                    <br/>
                                    At this point, copy also the
                                    <strong> Access Key ID </strong>
                                    , from step 1, into the
                                    <strong> Username </strong>
                                    field, and the
                                    <strong> Secret Access Key </strong>
                                    into the
                                    <strong> Password </strong>
                                    field.
                                </li>
                                <li>
                                    Save your settings in the Notification Manager.
                                </li>
                                <li>
                                    AWS by default gives you a small limit of emails you can send per day,
                                    however you can request that limit to be increased. Follow
                                    <a href="http://aws.amazon.com/ses/extendedaccessrequest" target="_blank"> this link </a>
                                    and fill out the form and your limit should be increased in the next 24h.
                                </li>
                            </ol>

                            <Ui.Section title="Step 3: Setup AWS SNS (Simple Notification Service)"/>
                            <ol>
                                <li>
                                    At this point you are already able to send emails,
                                    however if you keep sending emails that bounce back, AWS will suspend your account.
                                    <br/>
                                    In order to get more visibility into what is going on with your emails,
                                    AWS can send back some info to the Notification Manager via the SNS service.
                                </li>
                                <li>
                                    To setup SNS, in the top menu go to
                                    <strong> Services </strong>
                                    &gt;
                                    <strong> Mobile Services </strong>
                                    &gt;
                                    <strong> SNS </strong>
                                    .
                                </li>
                                <li>
                                    First you need to create 3 topics, one for handling bounce emails,
                                    one for complaints and one to get the info on successful deliveries.
                                    Note that the last one is optional.
                                </li>
                                <li>
                                    Start by creating the topics, in the left menu click
                                    <strong> Topics </strong>
                                    and then
                                    <strong> Create new topic </strong>
                                    .
                                    <br/>
                                    Give the topic a name, for example,
                                    <strong> "webiny-bounce" </strong>
                                    , for bounces,
                                    <strong> "webiny-complaint" </strong>
                                    , for complaints,
                                    and
                                    <strong> "webiny-delivery" </strong>
                                    , for deliveries.
                                    <br/>
                                    Leave the
                                    <strong> Display Name </strong>
                                    empty.
                                </li>
                                <li>
                                    Once you have your 2 (or 3) topics created, select the first topic, and then
                                    under
                                    <strong> Actions </strong>
                                    menu click on
                                    <strong> Subscribe to topic</strong>
                                    .
                                </li>
                                <li>
                                    Select HTTP or HTTPS as your protocol, and under
                                    <strong> Endpoint </strong>
                                    copy the matching endpoint that you can find on this page under the
                                    <strong> General </strong>
                                    tab.
                                </li>
                                <li>
                                    Once you have setup all the endpoints, click on the
                                    <strong> Subscriptions </strong>
                                    in the left menu.
                                    You should see your endpoints, and the Subscription ARN.
                                </li>
                                <li>
                                    Now it's time to tie your topics to the SES domains.
                                </li>
                            </ol>

                            <Ui.Section title="Step 4: Configure notifications"/>

                            <ol>
                                <li>
                                    Go back to your list of verified emails in SES.
                                    <br/>
                                    In case you verified the domains, go to the domain list.
                                </li>
                                <li>
                                    Click on the email, or the domain, to open the details page.
                                </li>
                                <li>
                                    On the details page open the
                                    <strong> Notifications </strong>
                                    section and
                                    click
                                    <strong> Edit Configuration</strong>
                                    .
                                </li>
                                <li>
                                    Connect the newly created SNS topics to the SES actions.
                                </li>
                                <li>
                                    All done, now you should start seeing information regarding bounces, complaints
                                    and deliveries on your notification dashboard.
                                </li>
                            </ol>

                        </Ui.Tabs.Tab>

                        <Ui.Tabs.Tab label="Cron Setup Guide" icon="icon-info-circle">
                            <Ui.Section title="About"/>

                            <p>
                                Notification manager sends all the emails in a background process,
                                this way your code doesn't have to wait for the SMTP connection to be established
                                and takes less time to execute.
                            </p>

                            <p>
                                This background process is triggered via a cron job. This cron job can be configured via crontab,
                                or via the Webiny Cron Manager app.
                            </p>

                            <p>
                                The cron should be configured so it executes the following script every minute:
                            </p>
                            <Ui.Copy.Input context="cron-job" value={webinyApiPath + '/services/notification-manager/mail-queue/send'}/>
                        </Ui.Tabs.Tab>
                    </Ui.Tabs>
                </Ui.Tabs.Tab>
            );
        }
    });
};