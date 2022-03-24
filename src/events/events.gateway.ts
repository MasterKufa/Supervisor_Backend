import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsJwtGuard } from 'src/auth/jwt-socket-auth.guard';
import { WithUser } from 'src/auth/types';
import { Call } from 'src/calls/calls.model';
import { CheckPolicies } from 'src/casl/casl.decorator';
import { PoliciesGuard } from 'src/casl/casl.guard';
import { Action, AppAbility } from 'src/casl/types';
import {
  AnswerPayload,
  EndedPayload,
  FailedPayload,
  NewIceCandidate,
  OfferPayload,
} from 'src/webrtc/types';
import { WebRTCService } from 'src/webrtc/webrtc.service';
import { EVENT_TYPES } from './constants';

@UseGuards(WsJwtGuard)
@UseGuards(PoliciesGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => WebRTCService))
    private webrtcService: WebRTCService,
  ) {}

  @SubscribeMessage(EVENT_TYPES.SIGNALING.OFFER)
  initCall(
    @MessageBody()
    payload: WithUser<OfferPayload>,
  ): void {
    this.webrtcService.handleOffer(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.ANSWER)
  answerCall(
    @MessageBody()
    payload: WithUser<AnswerPayload>,
  ): void {
    this.webrtcService.handleAnswer(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.ENDED)
  endCall(
    @MessageBody()
    payload: WithUser<EndedPayload>,
  ): void {
    this.webrtcService.handleEndCall(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.FAILED)
  failedCall(
    @MessageBody()
    payload: WithUser<FailedPayload>,
  ): void {
    this.webrtcService.handleFailedCall(payload);
  }

  @SubscribeMessage(EVENT_TYPES.SIGNALING.NEW_ICE)
  handleWebrtcNewIce(@MessageBody() payload: WithUser<NewIceCandidate>): void {
    this.webrtcService.handleNewIce(payload);
  }
}
