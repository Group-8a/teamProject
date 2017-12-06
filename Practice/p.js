<section ng-controller="ArticlesController" ng-init="find()">
  <div class="page-header">
    <h1>MIL Blog Posts</h1>
  </div>
  <h4 ui-sref=""> </h4>
  <div class="col-md-10">
  <div class="list-group">
    <a ng-repeat="article in articles" ui-sref="articles.view({articleId: article._id})" class="list-group-item">
      <small class="list-group-item-text">
        Posted on
        <span ng-bind="article.created | date:'mediumDate'"></span>
        by
        <span ng-bind="article.user.displayName"></span>
      </small>
      <h4 class="list-group-item-heading" ng-bind="article.title"></h4>
      <p class="list-group-item-text" ng-bind="article.content"></p>
      <h5><font color = "#2980B9"><span ng-bind="article.tags"></span></font></h5>
    </a>
  </div>
  <div class="alert alert-warning text-center" ng-if="articles.$resolved && !articles.length">
    No articles yet, why don't you <a ui-sref="articles.create">create one</a>?
  </div>
</div>
  <div class="col-md-2" style="background-color: #d3d3d3">
    <table cell-spacing="0">
      <tr>
        <th>
          <h3>Tags</h3>
        </th>
      </tr>
      <tr ng-repeat= "article in articles">
        <td ng-repeat="tags in article.tags" ng-click=filterByTags(tags)>
          <h5><a href = "">{{tags}}</a></h5>
        </td>
      </tr>
    </div>
</section>
