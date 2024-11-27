
type BroadcastMessageType = 'postChart' |  'deleteChart' | 'deleteAllCharts' |
							'postLines' | 'putLines' | 'deleteLine' |
							'deleteAllMarkers'
							

export interface BroadcastMessage {
	type: BroadcastMessageType;
	payload: any;
}
