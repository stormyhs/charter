
type BroadcastMessageType = 'postChart' |  'deleteChart' | 'deleteAllCharts' |
							'postLines' | 'putLines' | 'deleteLine'
							

export interface BroadcastMessage {
	type: BroadcastMessageType;
	payload: any;
}
