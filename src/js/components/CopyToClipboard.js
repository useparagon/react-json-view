import React from 'react';

import { toType } from './../helpers/util';

//clibboard icon
import { Clippy } from './icons';

//theme
import Theme from './../themes/getStyle';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            iconHovered: false
        };
    }

    copiedTimer = null;

    componentWillUnmount() {
        if (this.copiedTimer) {
            clearTimeout(this.copiedTimer);
            this.copiedTimer = null;
        }
    }

    handleCopy = () => {
        const container = document.createElement('textarea');
        const { clickCallback, src, namespace } = this.props;

        container.innerHTML = JSON.stringify(
            this.clipboardValue(src),
            null,
            '  '
        );

        document.body.appendChild(container);
        container.select();
        document.execCommand('copy');

        document.body.removeChild(container);

        this.copiedTimer = setTimeout(() => {
            this.setState({
                copied: false
            });
        }, 5500);

        this.setState({ copied: true }, () => {
            if (typeof clickCallback !== 'function') {
                return;
            }

            clickCallback({
                src: src,
                namespace: namespace,
                name: namespace[namespace.length - 1]
            });
        });
    };

    getClippyIcon = () => {
        const { theme } = this.props;

        return <Clippy class="copy-icon" {...Theme(theme, 'copy-icon')} />;
    };

    clipboardValue = value => {
        const type = toType(value);
        switch (type) {
            case 'function':
            case 'regexp':
                return value.toString();
            default:
                return value;
        }
    };

    render() {
        const { src, theme, hidden, rowHovered } = this.props;
        let style = Theme(theme, 'copy-to-clipboard').style;
        let display = 'inline';

        if (hidden) {
            display = 'none';
        }

        return (
            <span
                className="copy-to-clipboard-container copy-to-clipboard-icon"
                style={{
                    verticalAlign: 'top',
                    display: rowHovered ? 'inline-block' : 'none',
                    position: 'relative'
                }}
                onMouseEnter={() =>
                    this.setState({ ...this.state, iconHovered: true })
                }
                onMouseLeave={() =>
                    this.setState({ ...this.state, iconHovered: false })
                }
            >
                <span
                    style={{
                        ...style,
                        display: display
                    }}
                    onClick={this.handleCopy}
                >
                    {this.getClippyIcon()}
                </span>
                <span
                    class="copy-to-clipboard-tooltiptext"
                    style={{
                        visibility: this.state.iconHovered
                            ? 'visible'
                            : 'hidden',
                        width: this.state.copied ? '72px' :'40px',
                        backgroundColor: '#1C1F35',
                        color: '#fafafa',
                        textAlign: 'center',
                        borderRadius: '3px',
                        padding: '8px 4px',
                        position: 'absolute',
                        zIndex: 1,
                        top: '125%',
                        left: '50%',
                        marginLeft: this.state.copied? '-32px' :'-25px',
                        opacity: this.state.iconHovered ? 1 : 0,
                        animation: '.1s ease 0s 1 normal none running ihsWtb',
                        fontFamily: 'Inter,sans-serif',
                        fontSize: '11px',
                        fontWeight: '500'
                    }}
                >
                    {this.state.copied ? (
                        <span style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <svg
                                width="12"
                                height="11"
                                viewBox="0 0 12 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ marginRight: '-8px' }}
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.69396 0.5L3.87767 6.31629L1.9389 4.37753L0 6.31629L3.87767 10.194L11.6329 2.43876L9.69396 0.5Z"
                                    fill="white"
                                />
                            </svg>
                            {'  '} Copied
                        </span>
                    ) : (
                        'Copy'
                    )}
                </span>
            </span>
        );
    }
}
