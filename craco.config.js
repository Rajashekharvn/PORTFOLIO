module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Find the rule that handles .mjs and .js files
            const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
            if (oneOfRule) {
                const mjsRule = oneOfRule.oneOf.find(
                    (rule) => rule.test && rule.test.toString().includes('mjs')
                );
                if (mjsRule) {
                    mjsRule.resolve = {
                        ...mjsRule.resolve,
                        fullySpecified: false,
                    };
                }
            }

            // Also configure for regular .js files
            webpackConfig.module.rules.push({
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            });

            return webpackConfig;
        },
    },
};
