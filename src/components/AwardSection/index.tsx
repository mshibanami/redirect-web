import type { ReactNode } from 'react';
import Award from '@site/src/components/Award';
import AppleLogo from '@site/static/img/apple-logo.svg';

export default function AwardSection(): ReactNode {
    return (
        <div className='margin-vert--xl'>
            <Award
                header={
                    <span>Featured by</span>
                }
                main={
                    <span><AppleLogo style={{ width: '20px', height: 'auto', verticalAlign: 'text-bottom', paddingBottom: '0.15rem' }} /> Apple</span>
                }
                footer={
                    <span>The best Safari extensions</span>
                }
            />
        </div>
    );
}
