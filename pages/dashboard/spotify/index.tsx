import SpotifyIcon from "$/components/icons/SpotifyIcon";
import DashboardLayout from "$/components/layout/DashboardLayout";
import PlaylistTable from "$/components/services/PlaylistTable";
import { PlaylistType } from "$lib/services/types";
import { Page } from "$types/next";
import {
	Heading,
	HStack,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";

const Index: Page = () => {
	return (
		<>
			<HStack gap={5}>
				<SpotifyIcon h={16} w={16}></SpotifyIcon>
				<Heading>Spotify</Heading>
			</HStack>
			<Tabs variant="soft-rounded" mt={8}>
				<TabList>
					<Tab>Playlists</Tab>
					<Tab>Songs</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<PlaylistTable
							playlists={[
								{
									title: "2022",
									creator: "You",
									type: PlaylistType.public,
								},
							]}></PlaylistTable>
					</TabPanel>
					<TabPanel>
						<p>Songs</p>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
};

Index.layout = DashboardLayout;

export default Index;
