/**
 * Holds and provides all configuration names as constant.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ConfigNames {
    static readonly THUNDRA_APIKEY: string = 'thundra.apikey'

    static readonly THUNDRA_DEBUG_ENABLE: string = 'thundra.agent.debug.enable'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_DISABLE: string = 'thundra.agent.disable'
    static readonly THUNDRA_TRACE_DISABLE: string = 'thundra.agent.trace.disable'
    static readonly THUNDRA_METRIC_DISABLE: string = 'thundra.agent.metric.disable'
    static readonly THUNDRA_LOG_DISABLE: string = 'thundra.agent.log.disable'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_APPLICATION_ID: string = 'thundra.agent.application.id'
    static readonly THUNDRA_APPLICATION_INSTANCE_ID: string = 'thundra.agent.application.instanceid'
    static readonly THUNDRA_APPLICATION_REGION: string = 'thundra.agent.application.region'
    static readonly THUNDRA_APPLICATION_NAME: string = 'thundra.agent.application.name'
    static readonly THUNDRA_APPLICATION_STAGE: string = 'thundra.agent.application.stage'
    static readonly THUNDRA_APPLICATION_DOMAIN_NAME: string = 'thundra.agent.application.domainname'
    static readonly THUNDRA_APPLICATION_CLASS_NAME: string = 'thundra.agent.application.classname'
    static readonly THUNDRA_APPLICATION_VERSION: string = 'thundra.agent.application.version'
    static readonly THUNDRA_APPLICATION_TAG_PREFIX: string = 'thundra.agent.application.tag.'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_REPORT_REST_BASEURL: string = 'thundra.agent.report.rest.baseurl'
    static readonly THUNDRA_REPORT_REST_TRUSTALLCERTIFICATES: string =
        'thundra.agent.report.rest.trustallcertificates'
    static readonly THUNDRA_REPORT_REST_LOCAL: string = 'thundra.agent.report.rest.local'
    static readonly THUNDRA_REPORT_CLOUDWATCH_ENABLE: string = 'thundra.agent.report.cloudwatch.enable'
    static readonly THUNDRA_REPORT_MAX_SIZE: string = 'thundra.agent.report.maxsize'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_LAMBDA_HANDLER: string = 'thundra.agent.lambda.handler'

    static readonly THUNDRA_LAMBDA_WARMUP_WARMUPAWARE: string = 'thundra.agent.lambda.warmup.warmupaware'

    static readonly THUNDRA_LAMBDA_TIMEOUT_MARGIN: string = 'thundra.agent.lambda.timeout.margin'

    static readonly THUNDRA_LAMBDA_ERROR_STACKTRACE_MASK: string =
        'thundra.agent.lambda.error.stacktrace.mask'

    static readonly THUNDRA_TRACE_REQUEST_SKIP: string = 'thundra.agent.trace.request.skip'
    static readonly THUNDRA_TRACE_RESPONSE_SKIP: string = 'thundra.agent.trace.response.skip'
    static readonly THUNDRA_LAMBDA_TRACE_KINESIS_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.kinesis.request.enable'
    static readonly THUNDRA_LAMBDA_TRACE_FIREHOSE_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.firehose.request.enable'
    static readonly THUNDRA_LAMBDA_TRACE_CLOUDWATCHLOG_REQUEST_ENABLE: string =
        'thundra.agent.lambda.trace.cloudwatchlog.request.enable'
    static readonly THUNDRA_LAMBDA_AWS_STEPFUNCTIONS: string = 'thundra.agent.lambda.aws.stepfunctions'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_INVOCATION_SAMPLE_ONERROR: string = 'thundra.agent.invocation.sample.onerror'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_TRACE_INSTRUMENT_DISABLE: string = 'thundra.agent.trace.instrument.disable'
    static readonly THUNDRA_TRACE_INSTRUMENT_TRACEABLECONFIG: string =
        'thundra.agent.trace.instrument.traceableconfig'
    static readonly THUNDRA_TRACE_INSTRUMENT_FILE_PREFIX: string =
        'thundra.agent.trace.instrument.file.prefix'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_TRACE_SPAN_LISTENERCONFIG: string = 'thundra.agent.trace.span.listenerconfig'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_SAMPLER_TIMEAWARE_TIMEFREQ: string = 'thundra.agent.sampler.timeaware.timefreq'
    static readonly THUNDRA_SAMPLER_COUNTAWARE_COUNTFREQ: string =
        'thundra.agent.sampler.countaware.countfreq'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_TRACE_INTEGRATIONS_DISABLE: string = 'thundra.agent.trace.integrations.disable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_INSTRUMENT_ON_LOAD: string =
        'thundra.agent.trace.integrations.aws.instrument.onload'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SNS_MESSAGE_MASK: string =
        'thundra.agent.trace.integrations.aws.sns.message.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SNS_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.sns.traceinjection.disable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SQS_MESSAGE_MASK: string =
        'thundra.agent.trace.integrations.aws.sqs.message.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SQS_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.sqs.traceinjection.disable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_LAMBDA_PAYLOAD_MASK: string =
        'thundra.agent.trace.integrations.aws.lambda.payload.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_LAMBDA_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.aws.lambda.traceinjection.disable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_DYNAMODB_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.aws.dynamodb.statement.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_DYNAMODB_TRACEINJECTION_ENABLE: string =
        'thundra.agent.trace.integrations.aws.dynamodb.traceinjection.enable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_ATHENA_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.aws.athena.statement.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_BODY_MASK: string =
        'thundra.agent.trace.integrations.http.body.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_URL_DEPTH: string =
        'thundra.agent.trace.integrations.http.url.depth'
    static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_TRACEINJECTION_DISABLE: string =
        'thundra.agent.trace.integrations.http.traceinjection.disable'
    static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_ERROR_ON_4XX_DISABLE: string =
        'thundra.agent.trace.integrations.http.error.on4xx.disable'
    static readonly THUNDRA_TRACE_INTEGRATIONS_HTTP_ERROR_ON_5XX_DISABLE: string =
        'thundra.agent.trace.integrations.http.error.on5xx.disable'

    static readonly THUNDRA_TRACE_INTEGRATIONS_REDIS_COMMAND_MASK: string =
        'thundra.agent.trace.integrations.redis.command.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_RDB_STATEMENT_MASK: string =
        'thundra.agent.trace.integrations.rdb.statement.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_ELASTICSEARCH_BODY_MASK: string =
        'thundra.agent.trace.integrations.elasticsearch.body.mask'
    static readonly THUNDRA_TRACE_INTEGRATIONS_ELASTICSEARCH_PATH_DEPTH: string =
        'thundra.agent.trace.integrations.elasticsearch.path.depth'

    static readonly THUNDRA_TRACE_INTEGRATIONS_MONGODB_COMMAND_MASK: string =
        'thundra.agent.trace.integrations.mongodb.command.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_EVENTBRIDGE_DETAIL_MASK: string =
        'thundra.agent.trace.integrations.aws.eventbridge.detail.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SES_MAIL_MASK: string =
        'thundra.agent.trace.integrations.aws.ses.mail.mask'

    static readonly THUNDRA_TRACE_INTEGRATIONS_AWS_SES_MAIL_DESTINATION_MASK: string =
        'thundra.agent.trace.integrations.aws.ses.mail.destination.mask'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_LOG_CONSOLE_DISABLE: string = 'thundra.agent.log.console.disable'
    static readonly THUNDRA_LOG_LOGLEVEL: string = 'thundra.agent.log.loglevel'

    /////////////////////////////////////////////////////////////////////////////

    static readonly THUNDRA_LAMBDA_DEBUGGER_ENABLE: string = 'thundra.agent.lambda.debugger.enable'
    static readonly THUNDRA_LAMBDA_DEBUGGER_PORT: string = 'thundra.agent.lambda.debugger.port'
    static readonly THUNDRA_LAMBDA_DEBUGGER_LOGS_ENABLE: string = 'thundra.agent.lambda.debugger.logs.enable'
    static readonly THUNDRA_LAMBDA_DEBUGGER_WAIT_MAX: string = 'thundra.agent.lambda.debugger.wait.max'
    static readonly THUNDRA_LAMBDA_DEBUGGER_IO_WAIT: string = 'thundra.agent.lambda.debugger.io.wait'
    static readonly THUNDRA_LAMBDA_DEBUGGER_BROKER_PORT: string = 'thundra.agent.lambda.debugger.broker.port'
    static readonly THUNDRA_LAMBDA_DEBUGGER_BROKER_HOST: string = 'thundra.agent.lambda.debugger.broker.host'
    static readonly THUNDRA_LAMBDA_DEBUGGER_SESSION_NAME: string =
        'thundra.agent.lambda.debugger.session.name'
    static readonly THUNDRA_LAMBDA_DEBUGGER_AUTH_TOKEN: string = 'thundra.agent.lambda.debugger.auth.token'
}
