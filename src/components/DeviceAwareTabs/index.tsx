import React, { useEffect, useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Bowser from "bowser";

type DeviceTab = "mobile" | "desktop";

type DeviceAwareTabsProps = {
    groupId?: string;
    mobileLabel?: string;
    desktopLabel?: string;
    mobile: React.ReactNode;
    desktop: React.ReactNode;
    forceDefault?: DeviceTab;
    className?: string;
    id?: string;
};

function decidePreferredTabByUA(ua: string): DeviceTab {
    const parser = Bowser.getParser(ua);
    const os = (parser.getOSName(true) || "").toLowerCase();
    const platform = (parser.getPlatformType(true) || "").toLowerCase();

    const uaLower = ua.toLowerCase();
    const isAppleMobile =
        os === "ios" ||
        os === "ipados" ||
        os === "visionos" ||
        uaLower.includes("iphone") ||
        uaLower.includes("ipad") ||
        uaLower.includes("visionos");

    if (isAppleMobile) {
        return "mobile";
    }
    if (os === "macos") {
        return "desktop";
    }
    if (platform === "mobile" || platform === "tablet") {
        return "mobile";
    }
    return "desktop";
}

const DeviceAwareTabs: React.FC<DeviceAwareTabsProps> = ({
    groupId,
    mobileLabel = "Mobile",
    desktopLabel = "Desktop",
    mobile,
    desktop,
    forceDefault,
    className,
    id,
}) => {
    const [ready, setReady] = useState(false);
    const [defaultTab, setDefaultTab] = useState<DeviceTab>("desktop");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const ua = window.navigator.userAgent;
            const decided = forceDefault ?? decidePreferredTabByUA(ua);
            setDefaultTab(decided);
            setReady(true);
        }
    }, [forceDefault]);

    if (!ready) {
        return null;
    }

    return (
        <Tabs
            defaultValue={defaultTab}
            groupId={groupId}
            className={className}
            children={false}
        >
            <TabItem value="mobile" label={mobileLabel} children={""}>
                {mobile}
            </TabItem>
            <TabItem value="desktop" label={desktopLabel} children={""}>
                {desktop}
            </TabItem>
        </Tabs>
    );
};

export default DeviceAwareTabs;
