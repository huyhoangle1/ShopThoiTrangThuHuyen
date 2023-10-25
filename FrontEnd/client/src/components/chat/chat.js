import React, { useState } from 'react';
import Maximized from './Maximized';
import Minimized from './Minimized';
import { ThemeProvider, FixedWrapper, darkTheme, elegantTheme, purpleTheme, defaultTheme } from '@livechat/ui-kit';

const Chat = () => {
    const [openMaximize, setOpenMaximize] = useState(false);

    return (
        <div>
            <FixedWrapper.Root maximizedOnInit={false}>
                <FixedWrapper.Minimized>
                    <Minimized />
                </FixedWrapper.Minimized>
                <FixedWrapper.Maximized>
                    <Maximized />
                </FixedWrapper.Maximized>
            </FixedWrapper.Root>
        </div>
    );
};

export default Chat;
