import { Activity, ActivityTypes, BotAdapter, ConversationReference, TurnContext, ResourceResponse } from 'botbuilder';

export class MattermostAdapter extends BotAdapter {

    /**
     * Botkit plugin name
     */
    public name: string =  'Mattermost Adapter';

    constructor() {
        super();
    }

    /**
     * Botkit-only: Initialization function called automatically when used with Botkit.
     * @param botkit
     */
    public init(botkit): void {
        botkit.ready(() => {
            // do anything you might need to do.
        });
    }

    public async continueConversation(reference: Partial<ConversationReference>, logic: (context: TurnContext) => Promise<void>): Promise<void> {
        // this is pretty much boilerplate stuff that allows a dialog to resume.
        const request = TurnContext.applyConversationReference(
            { type: 'event', name: 'continueConversation' },
            reference,
            true
        );
        const context = new TurnContext(this, request);
        return this.runMiddleware(context, logic)
            .catch((err) => { console.error(err.toString()); });
    }

    public async deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void> {
        return undefined;
    }

    public async updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void> {
        return undefined;
    }


    public async sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]> {
        for (let i = 0; i < activities.length; i++) {
            console.log(activities[i].text);
        }
        return [];
    }


    public async processActivity(req, res, logic: (context: TurnContext) => Promise<void>): Promise<void> {
        const message = req.body;

        const activity = {
            timestamp: new Date(),
            channelId: 'webhook',
            conversation: {
                id: message.user
            },
            from: {
                id: message.user
            },
            recipient: {
                id: 'bot'
            },
            channelData: message,
            text: message.text,
            type: message.type === 'message' ? ActivityTypes.Message : ActivityTypes.Event
        };

        // set botkit's event type
        if (activity.type !== ActivityTypes.Message) {
            activity.channelData.botkitEventType = message.type;
        }

        // create a conversation reference
        const context = new TurnContext(this, activity as Activity);

        context.turnState.set('httpStatus', 200);

        await this.runMiddleware(context, logic)
            .then((x) => {console.log(x)})
            .catch((err) => { throw err; });

        // send http response back
        res.status(context.turnState.get('httpStatus'));
        if (context.turnState.get('httpBody')) {
            res.json(context.turnState.get('httpBody'));
        } else {
            res.end();
        }

    }

}
