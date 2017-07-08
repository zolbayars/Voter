'use strict';

(function () {

  var voteSubmitBtn = document.getElementById("vote-submit-btn");
  var pollIdInput = document.getElementById("poll-id");
  var apiUrl = '/api/polls/vote/' + pollData._id;
  var hasCustomOption = false;

  $("#poll-select")
    .change(function () {
      var str = "";
      $("#poll-select option:selected").each(function() {
        console.log($(this)[0].value);
        console.log($(this));
        if($(this)[0].value == "custom_option"){
          $("#newVoteOption").show();
          hasCustomOption = true;
        }else{
          $("#newVoteOption").hide();
          hasCustomOption = false;
        }
      });
    })
    .change();

    var ctx = $("#poll-detail-chart")
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: getOptionLabels(pollData),
        datasets: [{
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#281464"],
          data: getOptionVotes(pollData)
        }]
      },
      options: {
        layout: {
              padding: {
                  left: 50,
                  right: 50,
                  top: 20,
                  bottom: 0
              }
          }
      }
    });

    function removeChartData(chart) {

        while(chart.data.labels.length > 0) {
            chart.data.labels.pop();
        }

        chart.data.datasets.forEach((dataset) => {
            while(dataset.data.length > 0){
              dataset.data.pop();
            }
        });
        chart.update();
    }

    function updateChart(chart, newPollData){
      // console.log("chart.data");
      // console.log(chart.data);

      removeChartData(chart);

      Array.prototype.push.apply(chart.data.labels, getOptionLabels(newPollData));
      chart.data.datasets.forEach((dataset) => {
          Array.prototype.push.apply(dataset.data, getOptionVotes(newPollData));
      });

      chart.update();
    }

    function getOptionLabels(data){
      var result = [];
      data.options.forEach(function(element){
        console.log(element.option);
        result.push(element.option);
      });
      return result;
    }

    function getOptionVotes(data){
      var optionDatas = [];
      if(data.options != null && data.options.length > 0){
        data.options.forEach(function(element, index){
          optionDatas.push(0);
          if(data.voters != null && data.voters.length > 0){
            data.voters.forEach(function(voteElement){
              if(element.option == voteElement.option){
                optionDatas[index]++;
              }
            });
          }
        });
      }

  // Could show it when empty
      // var isDataAvailable = false;
      // optionDatas.forEach(function(element){
      //   if(element > 0){
      //     isDataAvailable = true;
      //   }
      // })
      //
      // if(!isDataAvailable){
      //   optionDatas = null;
      // }

      return optionDatas;
    }

    $("#add-vote-form").submit(function(event){
      event.preventDefault();

      $.ajax({
        type: 'POST',
        url: apiUrl,
        data: $("#add-vote-form").serialize(),
        success: function(response) {
          console.log("Response");
          console.log(response);

          updateChart(myChart, response);
        },
      });

    });
})();
