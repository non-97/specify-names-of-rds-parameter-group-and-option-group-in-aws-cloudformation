import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Parameter Group
    const dbParameterGroup = new cdk.aws_rds.ParameterGroup(
      this,
      "Parameter Group",
      {
        engine: cdk.aws_rds.DatabaseInstanceEngine.mysql({
          version: cdk.aws_rds.MysqlEngineVersion.VER_8_0,
        }),
      }
    );
    dbParameterGroup.bindToInstance({});

    // Parameter Group Name
    const cfnDbParameterGroup = dbParameterGroup.node
      .defaultChild as cdk.aws_rds.CfnDBParameterGroup;

    cfnDbParameterGroup.addPropertyOverride(
      "DBParameterGroupName",
      "rds-db-pg"
    );

    // Option Group
    const dbOptionGroup = new cdk.aws_rds.OptionGroup(this, "Option Group", {
      engine: cdk.aws_rds.DatabaseInstanceEngine.mysql({
        version: cdk.aws_rds.MysqlEngineVersion.VER_8_0,
      }),
      configurations: [
        {
          name: "MARIADB_AUDIT_PLUGIN",
          settings: {
            SERVER_AUDIT_EVENTS:
              "CONNECT,QUERY,QUERY_DDL,QUERY_DML,QUERY_DCL,QUERY_DML_NO_SELECT",
            SERVER_AUDIT_FILE_ROTATE_SIZE: "1000000",
            SERVER_AUDIT_FILE_ROTATIONS: "10",
          },
        },
      ],
    });

    // Option Group Name
    const cfnDbOptionGroup = dbOptionGroup.node
      .defaultChild as cdk.aws_rds.CfnOptionGroup;

    cfnDbOptionGroup.addPropertyOverride("OptionGroupName", "rds-db-og");
  }
}
