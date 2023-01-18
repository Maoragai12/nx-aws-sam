'use strict';

import {
    Tree,
    formatFiles,
    installPackagesTask,
    generateFiles,
    names,
    joinPathFragments,
} from '@nrwl/devkit';
import { addWorkspaceConfig } from './workspace.config';

export default async function(tree: Tree, schema: any) {

    const serviceRoot = `services/${schema.name}-service`;
    const { fileName } = names(schema.name);

    generateFiles(tree, joinPathFragments(__dirname, './files'), serviceRoot, {
        ...schema,
        tmpl: '',
        name: fileName,
    });

    const samBucketName = '';
    addWorkspaceConfig(tree, schema.name, serviceRoot, samBucketName);

    await formatFiles(tree);

    return () => {
        installPackagesTask(tree);
    };
}
