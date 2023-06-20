import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Request,
} from "tsoa";
import express from 'express';
import ctx from '../app-context';
import Member from "../domain/model/Member";
import PageDTO from "./PageDto";
import True from "../domain/spec/True";
import Page from "../domain/spec/Page";

@Route("users")
export class MembersController extends Controller {
  @Get("")
  public async root(): Promise<string> {
    return 'hello world!';
  }

  @Get("members")
  public async getMemberList(
    @Query() offset: number,
    @Query() limit: number,
  ): Promise<PageDTO<Member>> {
    return await ctx().memSvc.findPageBySpec(True(Member), Page.req({ offset, limit }));
  }

  @Get("members/{memberId}")
  public async getMember(@Path() memberId: number): Promise<Member> {
    return await ctx().memSvc.findById(memberId);
  }

  @Get("debug")
  public async debug(@Request() req: express.Request): Promise<object> {
    return {
      headers: req.headers,
      method: req.method,
      path: req.path,
      queries: req.query,
      body: req.body,
      params: req.params,
    };
  }
}
