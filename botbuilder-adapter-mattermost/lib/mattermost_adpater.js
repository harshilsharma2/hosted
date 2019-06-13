"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
class MattermostAdapter extends botbuilder_1.BotAdapter {
    constructor() {
        super();
        /**
         * Botkit plugin name
         */
        this.name = 'Mattermost Adapter';
    }
    /**
     * Botkit-only: Initialization function called automatically when used with Botkit.
     * @param botkit
     */
    init(botkit) {
        botkit.ready(() => {
            // do anything you might need to do.
        });
    }
    continueConversation(reference, logic) {
        return __awaiter(this, void 0, void 0, function* () {
            // this is pretty much boilerplate stuff that allows a dialog to resume.
            const request = botbuilder_1.TurnContext.applyConversationReference({ type: 'event', name: 'continueConversation' }, reference, true);
            const context = new botbuilder_1.TurnContext(this, request);
            return this.runMiddleware(context, logic)
                .catch((err) => { console.error(err.toString()); });
        });
    }
    deleteActivity(context, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    updateActivity(context, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    sendActivities(context, activities) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < activities.length; i++) {
                console.log(activities[i].text);
            }
            return [];
        });
    }
    processActivity(req, res, logic) {
        return __awaiter(this, void 0, void 0, function* () {
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
                type: message.type === 'message' ? botbuilder_1.ActivityTypes.Message : botbuilder_1.ActivityTypes.Event
            };
            // set botkit's event type
            if (activity.type !== botbuilder_1.ActivityTypes.Message) {
                activity.channelData.botkitEventType = message.type;
            }
            // create a conversation reference
            const context = new botbuilder_1.TurnContext(this, activity);
            context.turnState.set('httpStatus', 200);
            yield this.runMiddleware(context, logic)
                .then((x) => { console.log(x); })
                .catch((err) => { throw err; });
            // send http response back
            res.status(context.turnState.get('httpStatus'));
            if (context.turnState.get('httpBody')) {
                res.json(context.turnState.get('httpBody'));
            }
            else {
                res.end();
            }
        });
    }
}
exports.MattermostAdapter = MattermostAdapter;
//# sourceMappingURL=mattermost_adpater.js.map