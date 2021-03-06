import { Session, SessionConfig, SessionData } from "./types";
import { defaults, seal, unseal } from "@hapi/iron";
import { ServerResponse } from "http";
import serializeCookie from "$lib/cookie";
import getEnvVar from "$lib/env";

const config: SessionConfig = {
	cookieName: "auth",
	cookieOptions: {
		httpOnly: true,
		secure: true,
		path: "/",
		sameSite: "None",
		maxAge: 30 * 24 * 60 * 60,
	},
	password: getEnvVar("COOKIE_SECRET"),
};

const unsealData = async (cookie: string): Promise<SessionData | null> => {
	return await unseal(cookie, config.password, defaults);
};

const sealData = async (sessionData: SessionData): Promise<string> => {
	const sealedData = await seal(sessionData, config.password, defaults);

	if (sealedData.length > 4096) {
		throw new Error(
			"Cookie is too long, browsers wont accept it. Please reduce the size of the object you pass to session.save()",
		);
	}

	return serializeCookie(config.cookieName, sealedData, config.cookieOptions);
};

const destroyCookie = () => {
	return `auth=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getSession = async (
	cookies: { [key: string]: string },
	res: ServerResponse,
): Promise<Session> => {
	const save = async (data: SessionData) => {
		res.setHeader("Set-Cookie", await sealData(data));
	};

	const destroy = () => {
		res.setHeader("Set-Cookie", destroyCookie());
	};

	return {
		data: await getSessionData(cookies),
		save,
		destroy,
	};
};

export const hasAuthCookie = (cookies: { [key: string]: string }): boolean => {
	return !!cookies[config.cookieName];
};

const getSessionData = async (cookies: {
	[key: string]: string;
}): Promise<SessionData | null> => {
	const cookie = cookies[config.cookieName];

	if (!cookie) {
		return null;
	}

	return await unsealData(cookie);
};
