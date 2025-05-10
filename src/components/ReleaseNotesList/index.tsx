/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';
import ReleaseNotesListHeader from './Header';

function ListMetadata(props: Props): ReactNode {
    const { metadata } = props;
    const { blogTitle, blogDescription } = metadata;
    return (
        <>
            <PageMetadata title={blogTitle} description={blogDescription} />
            <SearchMetadata tag="blog_posts_list" />
        </>
    );
}

function ListContent(props: Props): ReactNode {
    const { metadata, items, sidebar } = props;
    const { blogTitle } = metadata;
    return (
        <BlogLayout sidebar={sidebar}>
            <ReleaseNotesListHeader blogTitle={blogTitle} />
            <BlogPostItems items={items} />
            <BlogListPaginator metadata={metadata} />
        </BlogLayout>
    );
}

export default function ReleaseNotesList(props: Props): ReactNode {
    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogListPage,
            )}>
            <ListMetadata {...props} />
            <ListContent {...props} />
        </HtmlClassNameProvider>
    );
}
