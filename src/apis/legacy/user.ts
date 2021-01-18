import fetch from 'node-fetch';
import { config } from '../../index';
import { Segment } from '../../types/segment/Segment';
import { SponsorBlockOptions } from '../interfaces';
import { statusCheck } from '../utils';

export class SponsorBlockLegacy {
	constructor(public userID: string, public options: SponsorBlockOptions = {}) {
		options.baseURL = options.baseURL ?? config.baseURL;
		options.hashPrefixLength = options.hashPrefixLength ?? config.hashPrefixLength;
	}

	// Legacy Calls
	/**
	 * Legacy API call to get videos' segments. Only returns segments of 'sponsor' category.
	 * @param videoID The ID of the video to get segments for.
	 * @deprecated This method is deprecated and should not be used.
	 */
	async getSegments(videoID: string): Promise<Segment[]> {
		let res = await fetch(`${this.options.baseURL}/api/getVideoSponsorTimes?videoID=${videoID}`);
		statusCheck(res);
		let data = (await res.json()) as { sponsorTimes: [number, number][]; UUIDs: string[] };
		let segments: Segment[] = [];
		for (let i = 0; i < data.UUIDs.length; i++) {
			segments.push({ UUID: data.UUIDs[i], startTime: data.sponsorTimes[i][0], endTime: data.sponsorTimes[i][1], category: 'sponsor' });
		}
		return segments;
	}

	/**
	 * Legacy API call to submit a sponsor segment, the segment's category will always be 'sponsor'.
	 * @param videoID The ID of the video to get segments for.
	 * @param startTime The start time of the segment.
	 * @param endTime The end time of the segment.
	 * @deprecated This method is deprecated and should not be used.
	 */
	async postSegment(videoID: string, startTime: number, endTime: number): Promise<void> {
		let res = await fetch(`${this.options.baseURL}/api/postVideoponsorTimes?userID=${this.userID}&videoID=${videoID}&startTime=${startTime}&endTime=${endTime}`);
		statusCheck(res);
		// returns nothing (status code 200)
	}
}
