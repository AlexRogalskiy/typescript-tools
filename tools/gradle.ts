import { Files } from '../src'
import determineJavaVersion = Files.determineJavaVersion

export class Gradle {
    private static gradleJavaVersionSupport = {
        5: { min: 8, max: 12 },
        6: { min: 8, max: 13 },
    }

    private readonly gradleSupportsThisJavaVersion: boolean

    constructor(gradleVersion: number) {
        const javaVersion = determineJavaVersion()

        if (Gradle.gradleJavaVersionSupport[gradleVersion] === undefined) {
            throw Error(`Unknown gradle version '${gradleVersion}'!`)
        }

        const supportedJavaVersions = Gradle.gradleJavaVersionSupport[gradleVersion] as {
            min: number
            max: number
        }

        this.gradleSupportsThisJavaVersion =
            javaVersion >= supportedJavaVersions.min && javaVersion <= supportedJavaVersions.max

        if (!this.gradleSupportsThisJavaVersion) {
            throw Error(
                `This test needs a Java version between ${supportedJavaVersions.min} and ${supportedJavaVersions.max}. The current Java version is ${javaVersion}.`,
            )
        }
    }

    get it(): jest.It {
        return !this.gradleSupportsThisJavaVersion ? it.skip : it
    }

    get describe(): jest.Describe {
        return !this.gradleSupportsThisJavaVersion ? describe.skip : describe
    }
}
